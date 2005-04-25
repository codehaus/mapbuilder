<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: geberates an HTTP payload to execute a WPS request
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id: wps_DescribeProcess.xsl,v 1.4 2005/03/30 20:26:54 camerons Exp $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:wps="http://www.opengis.net/wps"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:ows="http://www.opengis.net/ows"
		xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink">

  <xsl:output method="xml" omit-xml-declaration="no" encoding="utf-8" indent="yes"/>

  <xsl:param name="httpMethod">get</xsl:param>
  <xsl:param name="version"/>
  <xsl:param name="processName"/>
  <xsl:param name="store">false</xsl:param>
  
  <!-- template rule matching source root element -->
  <xsl:template match="wps:Process">
    <wps:Execute version="{$version}" service="WPS">
      <xsl:attribute name="store"><xsl:value-of select="$store"/></xsl:attribute>
      <xsl:choose>
        <xsl:when test="$httpMethod='post'">
        	<wps:ProcessName><xsl:value-of select="$processName"/></wps:ProcessName>
        </xsl:when>
        <xsl:otherwise>
          <QueryString>
            <xsl:variable name="query">
        request=Execute
   &amp;service=WPS
   &amp;version=<xsl:value-of select="$version"/>
  &amp;ProcessName=<xsl:value-of select="wps:Name"/>
              <xsl:apply-templates select="wps:Input"/>
            </xsl:variable>
            <xsl:value-of select="translate(normalize-space($query),' ', '' )" disable-output-escaping="no"/>
          </QueryString>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:apply-templates select="wps:Output"/>
    </wps:Execute>
  </xsl:template>
      
  <xsl:template match="wps:Output/wps:Parameter">
    &amp;<xsl:value-of select="wps:Name"/>=<xsl:apply-templates select="wps:Datatype"/>
  </xsl:template>

  <xsl:template match="wps:Input/wps:Parameter">
    &amp;<xsl:value-of select="wps:Name"/>=<xsl:apply-templates select="wps:Datatype"/>
  </xsl:template>

  <xsl:template match="wps:Datatype/wps:Reference">
    <xsl:value-of select="@xlink:href"/>
  </xsl:template>

  <xsl:template match="wps:Datatype/wps:LiteralValue">
    <xsl:value-of select="."/>
  </xsl:template>

  <xsl:template match="wps:Datatype/wps:ComplexValue">
    <xsl:value-of select="."/>
  </xsl:template>

  <xsl:template match="wps:Datatype/wps:BoundingBox">
    <xsl:value-of select="."/>
  </xsl:template>

  <xsl:template match="text()|@*"/>

</xsl:stylesheet>
