<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:gml="http://www.opengis.net/gml"
  version="1.0">
<!--
Description:  Convert GML to WKT.
Precondition: <coordinates> have been converted to <coords> (using
    GmlCoordinates2Coord.xsl).
Author:       Cameron Shorter cameron ATshorter.net, Nedjo Rogers nedjo ATgworks.ca
Licence:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: 
$Name$
-->
  <xsl:output method="xml" encoding="utf-8"/>
    <xsl:param name="objRef" select="objRef"/>
  <!-- Root node -->
  <xsl:template match="/">
    <js>
    <xsl:apply-templates/>
    </js>
  </xsl:template>

  <!-- Match and render a GML Point -->
  <xsl:template match="gml:pointMember/gml:Point | gml:pointProperty/gml:Point">
    <xsl:variable name="x0" select="gml:coord/gml:X"/>
    <xsl:variable name="y0" select="gml:coord/gml:Y"/>
    // Point
    <xsl:value-of select="$objRef"/>.setValue('POINT(<xsl:value-of select="$x0"/> <xsl:value-of select="$y0"/>)');
  </xsl:template>


  <!-- Match and render a LineString -->
  <xsl:template match="gml:LineString">
    <xsl:text>  <xsl:value-of select="$objRef"/>.setValue('LINESTRING(</xsl:text>
    <xsl:for-each select="gml:coord">
      <xsl:value-of select="gml:X"/>
      <xsl:text> </xsl:text>
      <xsl:value-of select="gml:Y"/>
      <xsl:if test="following-sibling::gml:coord">
        <xsl:text>,</xsl:text>
      </xsl:if>
    </xsl:for-each>
    <xsl:text>)');</xsl:text>
  </xsl:template>

  <xsl:template match="text()|@*"/>
  
</xsl:stylesheet>
