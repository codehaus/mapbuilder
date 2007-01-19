<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:gml="http://www.opengis.net/gml"
  version="1.0">
<!--
Description:  Convert GML to wz_jsgraphics function calls.
Precondition: <coordinates> have been converted to <coords> (using
    GmlCoordinates2Coord.xsl).
Author:       Nedjo Rogers nedjo ATgworks.ca, Cameron Shorter cameron ATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
$Name$
-->
  <xsl:output method="xml" encoding="utf-8"/>
  
  <xsl:param name="width" select="400"/>
  <xsl:param name="height" select="200"/>
  <xsl:param name="bBoxMinX" select="-180"/>
  <xsl:param name="bBoxMinY" select="-90"/>
  <xsl:param name="bBoxMaxX" select="180"/>
  <xsl:param name="bBoxMaxY" select="90"/>
  <xsl:param name="lineColor" select="'red'"/>
  <xsl:param name="lineWidth" select="1"/>
  <xsl:param name="crossSize" select="0"/>
  <xsl:param name="skinDir"/>
  <xsl:param name="pointDiameter" select="5"/>

  <xsl:variable name="xRatio" select="$width div ( $bBoxMaxX - $bBoxMinX )"/>
  <xsl:variable name="yRatio" select="$height div ( $bBoxMaxY - $bBoxMinY )"/>

  <!-- Root node -->
  <xsl:template match="/">
    <xsl:param name="geoWidth" select="$bBoxMaxX - $bBoxMinX"/>
    <xsl:param name="geoHeight" select="$bBoxMaxY - $bBoxMinY"/>
    <xsl:element name="svg">
      <xsl:attribute name="width"><xsl:value-of select="$width"/><xsl:text>px</xsl:text></xsl:attribute>
      <xsl:attribute name="height"><xsl:value-of select="$height"/><xsl:text>px</xsl:text></xsl:attribute>
        <xsl:attribute name="viewBox">
          <xsl:value-of select="$bBoxMinX"/>
          <xsl:text> </xsl:text>
          <xsl:value-of select="$bBoxMinY"/>
          <xsl:text> </xsl:text>
          <xsl:value-of select="$geoWidth"/>
          <xsl:text> </xsl:text>
          <xsl:value-of select="$geoHeight"/>
	</xsl:attribute>
        <xsl:element name="g">
          <xsl:attribute name="style"><xsl:text>fill-rule:evenodd; fill:none; stroke:none; stroke-antialiasing:true;</xsl:text></xsl:attribute>
          <xsl:attribute name="transform"><xsl:text>matrix(1 0 0 -1 0 0)</xsl:text></xsl:attribute>
          <xsl:apply-templates/>
        </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- Match and render a GML Point -->
  <xsl:template match="gml:pointMember/gml:Point | gml:pointProperty/gml:Point">
    <xsl:variable name="x0" select="gml:coord/gml:X"/>
    <xsl:variable name="y0" select="gml:coord/gml:Y"/>
      <xsl:element name="circle">
        <xsl:attribute name="cx"><xsl:value-of select="$x0"/></xsl:attribute>
        <xsl:attribute name="cy"><xsl:value-of select="$y0"/></xsl:attribute>
        <xsl:attribute name="r"><xsl:value-of select="$pointDiameter"/></xsl:attribute>
      </xsl:element>
  </xsl:template>

  <!-- Match and render a LineString -->
  <xsl:template match="gml:LineString">
    <xsl:choose>
      <!-- Draw a line -->
      <xsl:when test="count(gml:coord)!=1">
        <xsl:element name="polyline">
          <xsl:attribute name="points">
            <xsl:for-each select="gml:coord">
              <xsl:value-of select="gml:X"/>
              <xsl:text> </xsl:text>
              <xsl:value-of select="floor($height - (number(gml:Y) -$bBoxMinY)*$yRatio)"/>
              <xsl:if test="following-sibling::gml:coord">
                <xsl:text>,</xsl:text>
              </xsl:if>
            </xsl:for-each>
          </xsl:attribute>
        </xsl:element>
      </xsl:when>
      <!-- When one coord, draw point -->
      <xsl:otherwise>
        <xsl:variable name="x0" select="gml:coord/gml:X"/>
        <xsl:variable name="y0" select="gml:coord/gml:Y"/>
        <xsl:element name="circle">
          <xsl:attribute name="cx"><xsl:value-of select="$x0"/></xsl:attribute>
          <xsl:attribute name="cy"><xsl:value-of select="$y0"/></xsl:attribute>
          <xsl:attribute name="r"><xsl:value-of select="$pointDiameter"/></xsl:attribute>
        </xsl:element>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
